import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateTradeDto } from "./dto/create-trade.dto";
import { Pokemon } from "src/models/pokemon.model";
import { Trade } from "src/models/trade.model";
import { TradeResponse, TradeState } from "src/constants/types";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";

@Injectable()
export class TradesService {
  constructor(
    @Inject("POKEMON_REPOSITORY")
    private readonly pokemonRepository: typeof Pokemon,
    @Inject("TRADE_REPOSITORY")
    private readonly tradeRepository: typeof Trade,
    @Inject("SEQUELIZE")
    private readonly sequelize: Sequelize,
  ) {}

  async createTrade(createTradeDto: CreateTradeDto, user): Promise<Trade> {
    const { userId, pokemonId } = createTradeDto;
    if (user.userId !== userId) {
      throw new UnauthorizedException(
        "No puedes agregar pokémons a otro usuario",
      );
    }
    const existingPokemon = await this.pokemonRepository.findByPk(pokemonId);
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

  async getAvailableTrades(): Promise<Trade[]> {
    const response = await this.tradeRepository.findAll({
      where: {
        state: TradeState.PENDING,
      },
    });
    return response;
  }

  async proposeTrade(tradeId: number, userId: number, pokemonId: number) {
    const existingTrade = await this.tradeRepository.findByPk(tradeId);

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

    const existingPokemon = await this.pokemonRepository.findByPk(pokemonId);
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

        await this.pokemonRepository.update(
          {
            ownerId: existingTrade.user2Id,
          },
          {
            where: { id: existingTrade.pokemon1Id },
            transaction,
          },
        );

        await this.pokemonRepository.update(
          {
            ownerId: existingTrade.user1Id,
          },
          {
            where: { id: existingTrade.pokemon2Id },
            transaction,
          },
        );

        await transaction.commit();
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
      return TradeResponse.REJECT;
    }
  }
}
