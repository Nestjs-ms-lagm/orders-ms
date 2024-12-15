import { Controller, Logger, NotImplementedException, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChangeOrderStatusDto, CreateOrderDto } from './dto';
import { OrdersService } from './orders.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { OrderStatus } from '@prisma/client';
import { OrderPaginationDto } from 'src/common/dtos/order-pagination.dto';

@Controller()
export class OrdersController {
  private readonly logger: Logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) { }

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('findAllOrders')
  findAll(@Payload() orderPaginationDto: OrderPaginationDto) {
    this.logger.log('findAll with orderPaginationDto', { orderPaginationDto });
    return this.ordersService.findAll(orderPaginationDto);
  }

  @MessagePattern('findOneOrder')
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('changeOrderStatus')
  changeOrderStatus(
    @Payload() changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    this.logger.log('changeOrderStatus', { changeOrderStatusDto });
    return this.ordersService.changeStatus(changeOrderStatusDto);
  }

  @MessagePattern('changeOrderStatus3')
  changeOrderStatus3(
    @Payload() changeOrderStatusDto: ChangeOrderStatusDto
  ) {
    this.logger.log('changeOrderStatus3', { changeOrderStatusDto });
    return this.ordersService.changeStatus3(changeOrderStatusDto);
  }
}
