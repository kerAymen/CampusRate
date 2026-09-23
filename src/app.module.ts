import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlacesModule } from './places/places.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PersistenceModule } from './persistence/persistence.module';

@Module({
  imports: [PlacesModule, ReviewsModule, PersistenceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
