import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class OptionalRepository {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.optional.findMany({
      select: {
        id: true,
        type: true,
        label: true,
        name: true,
        values: {
          select: {
            label: true,
            value: true,
            id: true,
          },
        },
      },
    });
  }
  async create(data: any) {
    const { values, ...rest } = data;
    data = rest;
    let {id} = await this.prisma.optional.create({ data });
    if(values && values.length > 0){
      values.map(async (value: any) => {
        value.optionalId = id;
        await this.prisma.optionalFields.create({ data: value });
      })
    }
  }

  async update(id: number, data: any) {
    const { values, ...rest } = data;
    data = rest;
    await this.prisma.optional.update({
      where: {
        id: BigInt(id),
      },
      data,
    });
    if(values && values.length > 0){
      values.map(async (value: any) => {
        await this.prisma.$queryRaw`update public."optionalFields" set label=${value.label}, value=${value.value} WHERE id=${BigInt(value.id)} AND "optionalId"=${BigInt(id)};`;
      })
    }
  }

  async delete(id: number) { 
    await this.prisma.optionalFields.deleteMany({
      where: {
        optionalId: BigInt(id),
      },
    })
    await this.prisma.optional.delete({
      where: {
        id: BigInt(id),
      },
    });
    
  }
}
