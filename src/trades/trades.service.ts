import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateTradeDto } from "./dto/create-trade.dto";
import { Trade } from "src/models/trade.model";
import { TradeResponse, TradeState } from "src/constants/types";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";
import { NotificationService } from "src/notification/notification.service";
import { PokemonService } from "src/pokemon/pokemon.service";
import { Pokemon } from "src/models/pokemon.model";
import { Ability } from "src/models/ability.model";
import { Type } from "src/models/type.model";
import { User } from "src/models/user.model";

@Injectable()
export class TradesService {
  constructor(
    private readonly pokemonService: PokemonService,
    @Inject("TRADE_REPOSITORY")
    private readonly tradeRepository: typeof Trade,
    @Inject("SEQUELIZE")
    private readonly sequelize: Sequelize,
    private readonly notificationService: NotificationService,
  ) {}

  async createTrade(createTradeDto: CreateTradeDto, user): Promise<Trade> {
    const { userId, pokemonId } = createTradeDto;
    if (user.userId !== userId) {
      throw new UnauthorizedException(
        "No puedes agregar pokémons a otro usuario",
      );
    }
    const existingPokemon = await this.pokemonService.findByPk(pokemonId);
    if (!existingPokemon) {
      throw new NotFoundException("Pokémon no encontrado");
    }
    if (existingPokemon.ownerId !== userId) {
      throw new BadRequestException(
        `El Pokémon ${existingPokemon.id} no pertenece al usuario.`,
      );
    }

    const pokemonAlreadyInTrade = await this.tradeRepository.findOne({
      where: {
        state: ["PENDING", "PROPOSED"],
        [Op.or]: [{ pokemon1Id: pokemonId }, { pokemon2Id: pokemonId }],
      },
    });

    if (pokemonAlreadyInTrade) {
      throw new BadRequestException(
        "Este pokémon se encuentra en un trade pendiente. Espera a que finalice para intentar otro trade.",
      );
    }

    const createTrade = await this.tradeRepository.create({
      user1Id: userId,
      pokemon1Id: pokemonId,
    });
    return createTrade;
  }

  async getAvailableTrades(userId: number): Promise<Trade[]> {
    const response = await this.tradeRepository.findAll({
      where: {
        state: TradeState.PENDING,
        id: {
          [Op.not]: userId,
        },
      },
      include: [
        {
          model: Pokemon,
          as: "pokemon1",
          include: [{ model: Ability }, { model: Type }],
        },
        {
          model: Pokemon,
          as: "pokemon2",
          include: [{ model: Ability }, { model: Type }],
        },
        {
          model: User,
          as: "user1",
        },
        {
          model: User,
          as: "user2",
        },
      ],
    });
    return response;
  }

  async proposeTrade(tradeId: number, userId: number, pokemonId: number) {
    const existingTrade = await this.tradeRepository.findByPk(tradeId, {
      include: [
        {
          model: Pokemon,
          as: "pokemon1",
        },
      ],
    });

    const pokemonAlreadyInTrade = await this.tradeRepository.findOne({
      where: {
        state: ["PENDING", "PROPOSED"],
        [Op.or]: [{ pokemon1Id: pokemonId }, { pokemon2Id: pokemonId }],
        id: { [Op.not]: tradeId },
      },
    });

    if (pokemonAlreadyInTrade) {
      throw new BadRequestException(
        "Este pokémon se encuentra en un trade pendiente. Espera a que finalice para intentar otro trade.",
      );
    }

    if (!existingTrade) {
      throw new NotFoundException(`Trade ${tradeId} no encontrado`);
    }

    if (existingTrade.user1Id === userId) {
      throw new BadRequestException(
        "No puedes proponer un trade creado por ti.",
      );
    }

    const existingPokemon = await this.pokemonService.findByPk(pokemonId);
    if (!existingPokemon) {
      throw new NotFoundException("Pokémon no encontrado");
    }

    if (existingPokemon.ownerId !== userId) {
      throw new BadRequestException(
        `El Pokémon ${existingPokemon.id} no pertenece al usuario.`,
      );
    }

    await this.tradeRepository.update(
      {
        user2Id: userId,
        pokemon2Id: pokemonId,
        state: TradeState.PROPOSED,
      },
      {
        where: {
          id: tradeId,
        },
      },
    );

    const ownerPokemon = await this.pokemonService.findByPk(
      existingTrade.pokemon1Id,
    );

    const notificationMessage = `El usuario ${userId} quiere intercambiar su pokémon ${existingPokemon.name} por tu ${ownerPokemon.name} `;

    await this.notificationService.createNotification(
      existingTrade.user1Id,
      notificationMessage,
    );

    await this.notificationService.createNotification(
      userId,
      `Has ofrecido a ${existingPokemon.name} a cambio de ${existingTrade.pokemon1.name}. Debes esperar la respuesta del dueño. Buena suerte`,
    );

    return true;
  }

  async responseProposal(
    tradeId: number,
    userId: number,
    tradeResponse: TradeResponse,
  ) {
    const isResponseValid =
      Object.values(TradeResponse).includes(tradeResponse);
    if (!isResponseValid) {
      throw new BadRequestException("Verifique su respuesta al trade.");
    }
    const existingTrade = await this.tradeRepository.findByPk(tradeId);

    if (!existingTrade) {
      throw new NotFoundException(`Trade ${tradeId} no encontrado`);
    }

    if (existingTrade.user1Id !== userId) {
      throw new BadRequestException(
        "No puedes responder por un trade que no creaste",
      );
    }

    if (existingTrade.state !== TradeState.PROPOSED) {
      throw new BadRequestException("No puedes responder a este trade");
    }

    if (tradeResponse === TradeResponse.CONFIRM) {
      const transaction = await this.sequelize.transaction();

      try {
        await this.tradeRepository.update(
          {
            state: TradeState.COMPLETED,
          },
          {
            where: { id: tradeId },
            transaction,
          },
        );

        await this.pokemonService.tradePokemonOwnerId(
          existingTrade.pokemon1Id,
          existingTrade.user2Id,
          transaction,
        );
        await this.pokemonService.tradePokemonOwnerId(
          existingTrade.pokemon2Id,
          existingTrade.user1Id,
          transaction,
        );

        await transaction.commit();

        const notificationMessage = `Tu propuesta de intercambio por tu pokémon ${existingTrade.pokemon2.name} ha sido aceptado. Ahora tienes a ${existingTrade.pokemon1.name}`;

        await this.notificationService.createNotification(
          existingTrade.user2Id,
          notificationMessage,
        );
        return TradeResponse.CONFIRM;
      } catch (error) {
        await transaction.rollback();
        throw new BadRequestException("Error al procesar el intercambio");
      }
    } else if (tradeResponse === TradeResponse.REJECT) {
      await this.tradeRepository.update(
        { user2Id: null, pokemon2Id: null, state: TradeState.PENDING },
        {
          where: {
            id: tradeId,
          },
        },
      );

      const notificationMessage = `Tu propuesta de intercambio por tu pokémon ${existingTrade.pokemon2.name} para obtener a ${existingTrade.pokemon1.name} ha sido rechazado.`;

      await this.notificationService.createNotification(
        existingTrade.user2Id,
        notificationMessage,
      );

      return TradeResponse.REJECT;
    }
  }
}
