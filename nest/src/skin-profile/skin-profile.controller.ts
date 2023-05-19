import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/user.decorator';
import { User } from '@prisma/client';
import { UsersService } from '../prisma/users.service';
import { IsAuthenticatedGuard } from '../auth/guards/is-authenticated.guard';
import {
  DeleteSkinProfileDto,
  SetSkinProfileDto,
  UpdateSkinProfileDto,
} from './dto/update-skin-profile.dto';
import { SkinProfileService } from './skin-profile.service';

@Controller('skin-profile')
@UseGuards(IsAuthenticatedGuard)
export class SkinProfileController {
  constructor(private skinProfileService: SkinProfileService) {}

  @Get()
  getSkinProfile(@GetUser() user: User) {
    return this.skinProfileService.getSkinProfile(user.id);
  }

  @Post()
  updateSkinProfile(
    @GetUser() user: User,
    @Body() updateSkinProfileDto: UpdateSkinProfileDto,
  ) {
    return this.skinProfileService.setSkinProfile(
      (oldData, newData) => ({
        skinType: newData.skinType || oldData.skinType,
        filteredIngredients: [
          ...oldData.filteredIngredients,
          ...(newData.filteredIngredients || []),
        ],
        irritatingProducts: [
          ...oldData.irritatingProducts,
          ...(newData.irritatingProducts || []),
        ],
      }),
      user,
      updateSkinProfileDto.ingredientIds,
      updateSkinProfileDto.productIds,
      updateSkinProfileDto.skinType,
    );
  }

  @Delete()
  deleteSkinProfile(
    @GetUser() user: User,
    @Body() deleteSkinProfileDto: DeleteSkinProfileDto,
  ) {
    return this.skinProfileService.setSkinProfile(
      (oldData, newData) => ({
        skinType: newData.skinType || oldData.skinType,
        filteredIngredients: [
          ...oldData.filteredIngredients,
          ...(newData.filteredIngredients || []),
        ],
        irritatingProducts: [
          ...oldData.irritatingProducts,
          ...(newData.irritatingProducts || []),
        ],
      }),
      user,
      deleteSkinProfileDto.ingredientIds,
      deleteSkinProfileDto.productIds,
      deleteSkinProfileDto.skinType,
    );
  }

  @Put()
  setSkinProfile(
    @GetUser() user: User,
    @Body() setSkinProfileDto: SetSkinProfileDto,
  ) {
    return this.skinProfileService.setSkinProfile(
      (oldData, newData) => ({
        skinType: newData.skinType || oldData.skinType,
        filteredIngredients: [
          ...oldData.filteredIngredients,
          ...(newData.filteredIngredients || []),
        ],
        irritatingProducts: [
          ...oldData.irritatingProducts,
          ...(newData.irritatingProducts || []),
        ],
      }),
      user,
      setSkinProfileDto.ingredientIds,
      setSkinProfileDto.productIds,
      setSkinProfileDto.skinType,
    );
  }
}
