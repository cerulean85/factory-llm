import { Logger, Injectable, NotFoundException,  InternalServerErrorException, BadRequestException } from '@nestjs/common';

import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import * as fs from 'fs';
import * as path from 'path';
import { FILE_PATH } from 'src/config/config.config';
import { plainToInstance } from 'class-transformer';

import { FileDto } from './entities/file.entity';
import { CreateFileDto } from './dto/request/create-file.dto';
import { UpdateFileDto } from './dto/request/update-file.dto';
import { FileRepository } from './repositories/file.repository';
import { DownloadFileDto } from './dto/request/download-file.dto';
import { FileResponseDto } from './dto/response/file-response.dto';
import { FilteringFileDto } from './dto/request/filtering-file.dto';

@Injectable()
export class FileService {
    private readonly logger = new Logger(FileService.name)
    constructor(
    private readonly fileRepository: FileRepository,
  ) {}


  // 파일 찾기
  async fildFileById(fileId: number): Promise<FileResponseDto> {
    const filterDto = new FilteringFileDto();
    filterDto.fileId = fileId;
    const file = await this.fileRepository.getFilteredOne({filter: filterDto});
    if (!file) {
      this.logger.warn(`File not found : ${fileId}`);
      throw new NotFoundException(`File not found : ${fileId}`);
    }
    return plainToInstance(FileResponseDto, file, {excludeExtraneousValues: true});
  }

  // 파일 찾기
  async findFileByName(fileName: string): Promise<FileResponseDto> {
    const filterDto = new FilteringFileDto();
    filterDto.fileName = fileName;
    const file = await this.fileRepository.getFilteredOne({filter: filterDto});
    if (!file) {
      this.logger.warn(`File not found : ${fileName}`);
      throw new NotFoundException(`File not found : ${fileName}`);
    }
    return plainToInstance(FileResponseDto, file, {excludeExtraneousValues: true});
  }

  // 파일 업로드
  async createFile(createFileDto: CreateFileDto): Promise<FileResponseDto> {
    await this.makeFolder(FILE_PATH);
    const filterDto = new FilteringFileDto();
    filterDto.fileName = createFileDto.name;
    const existedFile = await this.fileRepository.getFilteredOne({filter: filterDto});
    if (existedFile) {
      this.logger.warn(`File already exists : ${createFileDto.name}`);
    }
    const uploadedFile = await this.fileRepository.createFile(createFileDto);
    return plainToInstance(FileResponseDto, uploadedFile, {excludeExtraneousValues: true});
  }

  // 파일 다운로드
  async downloadFile(downloadFileDto : DownloadFileDto): Promise<string> {
    await this.makeFolder(FILE_PATH);
    if (!downloadFileDto.path) {
      this.logger.warn(`File path is empty`);
      throw new NotFoundException(`File path is empty`);
    }
    const filterDto = new FilteringFileDto();
    filterDto.filePath = downloadFileDto.path;
    const filePath = await this.fileRepository.getFilteredOne({filter: filterDto});
    if (!filePath) {
      this.logger.warn(`File not found : ${downloadFileDto.path}`);
      throw new NotFoundException(`File not found : ${downloadFileDto.path}`);
    }
    const fullPath = path.resolve(FILE_PATH, filePath.stored_name);
    return fullPath;
  }

  // 파일 정보 수정
  async updateFile(fileId: number, updateFileDto: UpdateFileDto): Promise<FileResponseDto> {
    const result = await this.fileRepository.updateFile(fileId, updateFileDto);
    return plainToInstance(FileResponseDto, result, {excludeExtraneousValues: true});;
  }

  // 파일 정보 삭제
  async deleteFile(fileId: number): Promise<ResponseStatusDto> {
    const isSuccess = await this.fileRepository.deleteFile(fileId);
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = isSuccess;
    return resStatusDto;
  }

  // 파일 저장할 폴더 만들기
  private async makeFolder(folderPath: string): Promise<void> {
    const fullPath = path.resolve(folderPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      this.logger.log(`Directory created: ${fullPath}`);
    }
  }

  // 파일 찾기
  async getFilesByIdList(fileIdList: number[]): Promise<FileResponseDto[]> {
    const filterDto = new FilteringFileDto();
    filterDto.fileIdList = fileIdList;
    if (!fileIdList || fileIdList.length === 0) {
      this.logger.warn('Empty file ID list provided');
      return [];
    }

    const files = await this.fileRepository.getFilteredList({filter: filterDto});
    if (!files) {
      this.logger.warn(`File not found : ${fileIdList}`);
      return [];
    }
    const result = plainToInstance(FileResponseDto, files, {excludeExtraneousValues: true});
    return result;
  }
}