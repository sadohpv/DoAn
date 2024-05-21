import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @IsNumber()
  idPost: number;

  content: any;
}
