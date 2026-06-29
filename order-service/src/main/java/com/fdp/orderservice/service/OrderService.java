package com.fdp.orderservice.service;

import com.fdp.orderservice.dto.OrderRequest;
import com.fdp.orderservice.dto.OrderResponse;

import java.util.List;
import java.util.UUID;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    OrderResponse getOrderById(UUID id);
    List<OrderResponse> getOrders(UUID customerId);
    OrderResponse acceptOrder(UUID id);
    OrderResponse dispatchOrder(UUID id);
    OrderResponse deliverOrder(UUID id);
    OrderResponse cancelOrder(UUID id, String reason);
}
