<?php

class DashboardController {

    public function stats(): never {
        AuthMiddleware::requireAuth();
        $reservationModel = new Reservation();
        $messageModel     = new Message();
        $dishModel        = new Dish();

        Response::success([
            'reservations_today' => $reservationModel->getTodayCount(),
            'pending_count'      => $reservationModel->getPendingCount(),
            'messages_unread'    => $messageModel->getUnreadCount(),
            'dishes_count'       => $dishModel->getCount(),
        ]);
    }

    public function recent(): never {
        AuthMiddleware::requireAuth();
        $reservationModel = new Reservation();
        $messageModel     = new Message();

        Response::success([
            'reservations' => $reservationModel->getRecentForDashboard(5),
            'messages'     => $messageModel->getRecentForDashboard(5),
        ]);
    }
}
