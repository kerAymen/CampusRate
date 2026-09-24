import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService],
  exports: [PlacesService],
  imports: [PersistenceModule],
})
export class PlacesModule {}
