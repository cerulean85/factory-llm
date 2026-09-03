import { 
  Body,
  Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';

import { 
  ApiBody,
  } from '@nestjs/swagger';

import { PalletAlarmHistoryService } from './pallet-alarm-history.service';

@Controller('alarm-history')
export class PalletAlarmHistoryController {
  constructor(
    private readonly palletAlarmHistoryService : PalletAlarmHistoryService,
  ) {}
};

