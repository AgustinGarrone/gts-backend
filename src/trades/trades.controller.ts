import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from "@nestjs/common";
import { TradesService } from "./trades.service";
import { CreateTradeDto } from "./dto/create-trade.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { ApiResponse, TradeResponse } from "src/constants/types";
import { Trade } from "src/models/trade.model";
import { GetUserFromJwt } from "src/helpers/getUser.helper";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Trades")
@ApiBearerAuth()
@Controller("trades")
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTrade(
    @Body() createTradeDto: CreateTradeDto,
    @GetUserFromJwt() user,
  ): Promise<ApiResponse<Trade>> {
    try {
      const createdTrade = await this.tradesService.createTrade(
        createTradeDto,
        user,
      );
      return {
        statusCode: HttpStatus.OK,
        message: "Trade creado con éxito",
        data: createdTrade,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAvailableTrades(
    @GetUserFromJwt() user,
  ): Promise<ApiResponse<Trade[]>> {
    try {
      const availableTrades = await this.tradesService.getAvailableTrades(
        user.userId,
      );
      return {
        statusCode: HttpStatus.OK,
        message: "Trades obtenidos con éxito",
        data: availableTrades,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/propose")
  async proposeTrade(
    @Param("id", ParseIntPipe) tradeId: number,
    @Body("pokemonId") pokemonId: number,
    @GetUserFromJwt() user,
  ): Promise<ApiResponse<boolean>> {
    try {
      await this.tradesService.proposeTrade(+tradeId, user.userId, pokemonId);
      return {
        statusCode: HttpStatus.OK,
        message: "Trade propuesto.",
        data: true,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/responseProposal")
  async responseProposal(
    @Param("id") tradeId: number,
    @Body("tradeResponse") tradeResponse: TradeResponse,
    @GetUserFromJwt() user,
  ): Promise<ApiResponse<TradeResponse>> {
    try {
      console.log(tradeResponse);
      const response = await this.tradesService.responseProposal(
        +tradeId,
        user.userId,
        tradeResponse,
      );
      return {
        statusCode: HttpStatus.OK,
        message:
          response === TradeResponse.CONFIRM
            ? "Trade confirmado con éxito"
            : "Trade rechazado con éxito",
        data: response,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
