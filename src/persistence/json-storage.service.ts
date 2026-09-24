import { Injectable, InternalServerErrorException, } from '@nestjs/common';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

@Injectable()
export class JsonStorageService {
  private readonly filePath: string;

  constructor() {
    this.filePath =
      process.env.DATA_FILE_PATH ?? 'data/campus-rate.json';
  }

  private async initializeFile(): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });

    try {
      await readFile(this.filePath, 'utf-8');
    } catch {
      const initialData = {
        places: [],
        reviews: [],
      };

      await writeFile(
        this.filePath,
        JSON.stringify(initialData, null, 2),
        'utf-8',
      );
    }
  }

  async read(): Promise<any> {
    await this.initializeFile();

    const content = await readFile(this.filePath, 'utf-8');

    try {
      return JSON.parse(content);
    } catch {
      throw new InternalServerErrorException('Le fichier de données a un JSON invalide.');
    }
  }

  async write(data: any): Promise<void> {
    await this.initializeFile();

    await writeFile(
      this.filePath,
      JSON.stringify(data, null, 2),
      'utf-8',
    );
  }
}