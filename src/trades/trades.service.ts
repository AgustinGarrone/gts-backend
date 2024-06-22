import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateTradeDto } from "./dto/create-trade.dto";
import { UpdateTradeDto } from "./dto/update-trade.dto";
import { Pokemon } from "src/models/pokemon.model";
import { Trade } from "src/models/trade.model";
import { TradeState } from "src/constants/types";

@Injectable()
export class TradesService {
  constructor(
    @Inject("POKEMON_REPOSITORY")
    private readonly pokemonRepository: typeof Pokemon,
    @Inject("TRADE_REPOSITORY")
    private readonly tradeRepository: typeof Trade,
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

  async proposeTrade(id: number) {
    return `This action returns a #${id} trade`;
  }

  async rejectTrade(id: number, updateTradeDto: UpdateTradeDto) {
    return `This action returns a #${id} trade`;
  }

  async confirmTrade(id: number, updateTradeDto: UpdateTradeDto) {
    return `This action returns a #${id} trade`;
  }
}
