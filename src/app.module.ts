import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as process from 'process';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configSrv: ConfigService) => {
        return {
          type: 'postgres',
          host: configSrv.get('DB_HOST'),
          port: configSrv.get('PORT'),
          username: configSrv.get('DB_USERNAME'),
          password: configSrv.get('DB_PASSWORD'),
          database: configSrv.get('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
