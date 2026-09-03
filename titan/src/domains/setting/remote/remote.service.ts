import { Logger, Injectable, NotFoundException,  InternalServerErrorException, forwardRef, Inject } from '@nestjs/common';
import { Remote } from './entities/remote.entity';
import { RemoteRepository } from './respositories/remote.repository';
import { CreateRemoteDto } from './dto/request/create-remote.dto';
import { UsersService } from '../../users/users/users.service';
import { UpdateRemoteDto } from './dto/request/update-remote.dto';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { FilteringRemoteDto } from './dto/request/filtering-remote.dto';

@Injectable()
export class RemoteService {
    private readonly logger = new Logger(RemoteService.name)
    constructor(
    private readonly remoteRepository: RemoteRepository,
    private readonly usersService: UsersService
  ) {}

  async createRemote(createRemoteDto: CreateRemoteDto) {
    const seqId = createRemoteDto.seq_id;
    const users = await this.usersService.findUsersEntityBySeqId(seqId);
    if (!users) {
      this.logger.warn(`users with seqId ${seqId} not found`);
      throw new NotFoundException(`users with seqId ${seqId} not found`);
    }
    const newRemote = await this.remoteRepository.createRemote(users, createRemoteDto);
    return newRemote;
  }

  async getAllRemote() : Promise<Remote[]> {
    const result = await this.remoteRepository.getFilteredList();
    return result;
  }

  async getRemoteByseqId(seqId : number) : Promise<Remote[]>{
    const findUsers = await this.usersService.findUsersEntityBySeqId(seqId);
    if (!findUsers) {
      this.logger.warn('users not found');
      throw new NotFoundException('users not found');
    }
    const filterDto = new FilteringRemoteDto();
    filterDto.userSeqId = seqId;
    const result = await this.remoteRepository.getFilteredList({ filter: filterDto });
    return result;
  }

  async updateRemote(remoteId: number, updateRemoteDto: UpdateRemoteDto): Promise<ResponseStatusDto>{
    const { seq_id: seqId, ...rest } = updateRemoteDto;
    const filterDto = new FilteringRemoteDto();
    filterDto.remoteId = remoteId;

    const remote = await this.remoteRepository.getFilteredOne({ filter: filterDto });
    if (!remote) {
      this.logger.warn(`Remote with ID ${remoteId} not found`);
      throw new NotFoundException(`Remote with ID ${remoteId} not found`);
    }

    const users = seqId ? await this.usersService.findUsersEntityBySeqId(seqId) : remote.users;
    if (!users) {
      this.logger.warn(`User with ID ${seqId} not found`);
      throw new NotFoundException(`User with ID ${seqId} not found`);
    }
    const result = await this.remoteRepository.updateRemote(remote, users, updateRemoteDto);
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = result;
    resStatusDto.message = result ? 'Remote updated successfully' : 'Remote update failed';
    return resStatusDto;
  }

  async deleteRemoteById(remoteId: number): Promise<ResponseStatusDto> {
    const result = await this.remoteRepository.softDeleteRemoteById(remoteId);
    if (!result) {
      this.logger.warn(`Remote with ID ${remoteId} not found`);
      throw new NotFoundException(`Remote with ID ${remoteId} not found`);        
    }
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = true;
    return resStatusDto;
  }
}