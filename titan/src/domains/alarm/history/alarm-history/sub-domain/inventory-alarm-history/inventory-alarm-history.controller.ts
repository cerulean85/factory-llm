import { 
  Body,
  Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';

import { 
  ApiBody,
  } from '@nestjs/swagger';

import { InventoryAlarmHistoryService } from './inventory-alarm-history.service';

@Controller('alarm-history')
export class InventoryAlarmHistoryController {
  constructor(
    private readonly inventoryAlarmHistoryService : InventoryAlarmHistoryService,
  ) {}
};

