import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { catchError, map, Observable, of } from 'rxjs';
import { User, UserRole } from '../models/user.interface';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // eslint-disable-next-line @typescript-eslint/ban-types
  create(@Body() createUserDto: CreateUserDto): Observable<User | Object> {
    return this.usersService.create(createUserDto).pipe(
      map((user: User) => user),
      catchError((err) => of({ error: err.message })),
    );
  }

  @Post('login')
  // eslint-disable-next-line @typescript-eslint/ban-types
  login(@Body() user: User): Observable<Object> {
    return this.usersService
      .login(user)
      .pipe(map((jwt: string) => ({ accessToken: jwt })));
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;

    return this.usersService.paginate({
      page,
      limit,
      route: 'http://localhost:3000/users',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Put(':id')
  updateOne(
    @Param('id') id: string,
    @Body() User: CreateUserDto,
  ): Observable<any> {
    return this.usersService.updateOne(id, User);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Observable<User> {
    return this.usersService.remove(id);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(
    @Param('id') id: string,
    @Body() user: User,
  ): Observable<User> {
    return this.usersService.updateRoleOfUser(id, user);
  }
}
