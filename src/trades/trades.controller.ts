import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { TradesService } from "./trades.service";
import { CreateTradeDto } from "./dto/create-trade.dto";
import { UpdateTradeDto } from "./dto/update-trade.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { ApiResponse } from "src/constants/types";
import { Trade } from "src/models/trade.model";
import { GetUserFromJwt } from "src/helpers/getUser.helper";

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
  async getAvailableTrades(): Promise<ApiResponse<Trade[]>> {
    try {
      const availableTrades = await this.tradesService.getAvailableTrades();
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
  proposeTrade(@Param("id") id: number) {
    return this.tradesService.proposeTrade(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/reject")
  rejectTrade(@Param("id") id: number, @Body() updateTradeDto: UpdateTradeDto) {
    return this.tradesService.rejectTrade(+id, updateTradeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/confirm")
  confirmTrade(
    @Param("id") id: number,
    @Body() updateTradeDto: UpdateTradeDto,
  ) {
    return this.tradesService.confirmTrade(+id, updateTradeDto);
  }
}
