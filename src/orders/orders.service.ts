import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Order, OrderStatus, PrismaClient } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { RpcException } from '@nestjs/microservices';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { OrderPaginationDto } from 'src/common/dtos/order-pagination.dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  private readonly logger: Logger = new Logger(OrdersService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database is connected!');
  }

  create(createOrderDto: CreateOrderDto) {
    this.logger.log('create order', { createOrderDto });
    return this.order.create({
      data: createOrderDto
    });
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    this.logger.log('findAll orders with orderPaginationDto: ', { orderPaginationDto });

    const { limit, page, status } = orderPaginationDto;

    const whereClause = status ? { status: status as OrderStatus } : {};

    const totalPages: number = await this.order.count({
      where: whereClause
    });

    const offset: number = (page - 1) * limit;
    const lastPage = Math.ceil(totalPages / limit);

    this.logger.log('parameters for findMany: ', {
      take: limit,
      skip: offset,
      page,
      status
    });

    const response = {
      data: await this.order.findMany({
        skip: offset,
        take: limit,
        where: whereClause
      }),
      meta: {
        total: totalPages,
        page,
        lastPage,
      }
    };

    return response;
  }

  async findOne(id: string) {
    this.logger.log(`findOne order with id=${id}`);
    // return this.order.findUnique({
    //   where: { id }
    // });
    const order: Order = await this.order.findFirst({
      where: { id }
    })

    if (!order) {
      // throw new NotFoundException(`Order with id=${id} not found`);
      throw new RpcException({
        message: `Order with id=${id} not found`,
        status: HttpStatus.NOT_FOUND
      });
    }

    return order;
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;
    this.logger.log('changeStatus: ', { changeOrderStatusDto });

    const updatedOrder: Order = await this.order.update({
      where: { id },
      data: {
        status
      }
    });

    this.logger.log('updatedOrder: ', { updatedOrder });
    return updatedOrder;
  }

  async changeStatus3(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;
    this.logger.log('changeStatus3: ', { changeOrderStatusDto });

    const order = await this.findOne(id);

    if (order.status === status) {
      this.logger.log('Not necesary to change status: ', { order });
      return order;
    }

    const updatedOrder: Order = await this.order.update({
      where: { id },
      data: { status }
    });

    this.logger.log('updatedOrder: ', { updatedOrder });
    return updatedOrder;
  }
}
