import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Phuc An Hotel APIs')
    .setDescription('The API for Phuc An Hotel')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT, () => {
    console.log(`server running on port: ${process.env.PORT}`);
    console.log(`swagger: http://localhost:${process.env.PORT}/swagger`);
  });
}
bootstrap();
