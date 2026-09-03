import { Logger, Injectable, NotFoundException } from '@nestjs/common';
import { SystemRepository } from './respositories/system.repository';
import { CreateSystemDto } from './dto/request/create-system.dto';
import { UpdateSystemDto } from './dto/request/update-system.dto';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { plainToInstance } from 'class-transformer';
import { SystemResponseDto } from './dto/response/system-response.dto';
import { System } from './entities/system.entity';

@Injectable()
export class SystemService {
  private readonly logger = new Logger(SystemService.name);
  constructor(private readonly systemRepository: SystemRepository) {}
  async onModuleInit() {
    await this.initSetting();
  }

  private async initSetting() {
    const system = await this.systemRepository.getFilteredOne();
    if (!system) {
      await this.createDefaultSetting();
      await this.initSetting();
    }
  }

  private async createDefaultSetting() {
    try {
      var dto = new CreateSystemDto();
      await this.systemRepository.createSystem(dto);
    } catch (error) {
      this.logger.error('Error creating default system settings', error);
      throw new NotFoundException('Error creating default system settings');
    }
  }

  async createSystem(
    createSystemDto: CreateSystemDto,
  ): Promise<SystemResponseDto> {
    const newSystem = await this.systemRepository.createSystem(createSystemDto);
    const result = plainToInstance(SystemResponseDto, newSystem, {
      excludeExtraneousValues: true,
    });
    return result;
  }

  async getSystem(): Promise<System> {
    const system = await this.systemRepository.getFilteredOne();
    if (!system) {
      throw new NotFoundException('System not found');
    }
    return system;
  }

  async updateSystem(
    updateSystemDto: UpdateSystemDto,
  ): Promise<ResponseStatusDto> {
    let result;
    const system = await this.systemRepository.getFilteredOne();

    if (!system) {
      throw new NotFoundException('System not found');
    }

    // 알람 보내기가 off인 경우 -> 알람 여부는 전부 false으로 변경
    if (updateSystemDto.alarm_send_enabled === false) {
      const updatedData = new UpdateSystemDto();
      updatedData.alarm_send_enabled = false;
      updatedData.equipment_alarm_enabled = false;
      updatedData.inventory_alarm_enabled = false;
      result = await this.systemRepository.updateSystem(system, updatedData);
    } else {
      result = await this.systemRepository.updateSystem(
        system,
        updateSystemDto,
      ); // 그 외 나머지 경우 업데이트
    }
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = result;
    resStatusDto.message = result
      ? 'System updated successfully'
      : 'Failed to update system';
    return resStatusDto;
  }

  async getUpdateRefreshBrowser(): Promise<boolean> {
    const system = await this.systemRepository.getFilteredOne();
    if (!system) {
      throw new NotFoundException('System not found');
    }

    const refreshBrowser = system?.refresh_browser ?? false;
    if (refreshBrowser) {
      await this.systemRepository.updateSystem(system, {
        refresh_browser: false,
      });
    }

    return refreshBrowser;
  }
}
