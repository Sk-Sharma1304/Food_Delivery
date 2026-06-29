package com.fdp.orderservice.mapper;

import com.fdp.orderservice.dto.OrderItemResponse;
import com.fdp.orderservice.dto.OrderResponse;
import com.fdp.orderservice.dto.OrderStatusHistoryResponse;
import com.fdp.orderservice.entity.Order;
import com.fdp.orderservice.entity.OrderItem;
import com.fdp.orderservice.entity.OrderStatusHistory;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-27T12:36:31+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Oracle Corporation)"
)
@Component
public class OrderMapperImpl implements OrderMapper {

    @Override
    public OrderResponse toOrderResponse(Order order) {
        if ( order == null ) {
            return null;
        }

        OrderResponse.OrderResponseBuilder orderResponse = OrderResponse.builder();

        orderResponse.id( order.getId() );
        orderResponse.customerId( order.getCustomerId() );
        orderResponse.restaurantId( order.getRestaurantId() );
        orderResponse.status( order.getStatus() );
        orderResponse.totalAmount( order.getTotalAmount() );
        orderResponse.items( orderItemListToOrderItemResponseList( order.getItems() ) );
        orderResponse.statusHistory( orderStatusHistoryListToOrderStatusHistoryResponseList( order.getStatusHistory() ) );
        orderResponse.createdAt( order.getCreatedAt() );
        orderResponse.updatedAt( order.getUpdatedAt() );

        return orderResponse.build();
    }

    @Override
    public OrderItemResponse toOrderItemResponse(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }

        OrderItemResponse.OrderItemResponseBuilder orderItemResponse = OrderItemResponse.builder();

        orderItemResponse.id( orderItem.getId() );
        orderItemResponse.menuItemId( orderItem.getMenuItemId() );
        orderItemResponse.name( orderItem.getName() );
        orderItemResponse.price( orderItem.getPrice() );
        orderItemResponse.quantity( orderItem.getQuantity() );

        return orderItemResponse.build();
    }

    @Override
    public OrderStatusHistoryResponse toOrderStatusHistoryResponse(OrderStatusHistory orderStatusHistory) {
        if ( orderStatusHistory == null ) {
            return null;
        }

        OrderStatusHistoryResponse.OrderStatusHistoryResponseBuilder orderStatusHistoryResponse = OrderStatusHistoryResponse.builder();

        orderStatusHistoryResponse.id( orderStatusHistory.getId() );
        orderStatusHistoryResponse.previousStatus( orderStatusHistory.getPreviousStatus() );
        orderStatusHistoryResponse.newStatus( orderStatusHistory.getNewStatus() );
        orderStatusHistoryResponse.transitionTime( orderStatusHistory.getTransitionTime() );
        orderStatusHistoryResponse.reason( orderStatusHistory.getReason() );

        return orderStatusHistoryResponse.build();
    }

    @Override
    public List<OrderResponse> toOrderResponseList(List<Order> orders) {
        if ( orders == null ) {
            return null;
        }

        List<OrderResponse> list = new ArrayList<OrderResponse>( orders.size() );
        for ( Order order : orders ) {
            list.add( toOrderResponse( order ) );
        }

        return list;
    }

    protected List<OrderItemResponse> orderItemListToOrderItemResponseList(List<OrderItem> list) {
        if ( list == null ) {
            return null;
        }

        List<OrderItemResponse> list1 = new ArrayList<OrderItemResponse>( list.size() );
        for ( OrderItem orderItem : list ) {
            list1.add( toOrderItemResponse( orderItem ) );
        }

        return list1;
    }

    protected List<OrderStatusHistoryResponse> orderStatusHistoryListToOrderStatusHistoryResponseList(List<OrderStatusHistory> list) {
        if ( list == null ) {
            return null;
        }

        List<OrderStatusHistoryResponse> list1 = new ArrayList<OrderStatusHistoryResponse>( list.size() );
        for ( OrderStatusHistory orderStatusHistory : list ) {
            list1.add( toOrderStatusHistoryResponse( orderStatusHistory ) );
        }

        return list1;
    }
}
