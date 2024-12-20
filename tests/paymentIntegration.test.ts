import { createMocks } from 'node-mocks-http';
import handler from 'pages/api/payments';
import sequelize from 'sequelize/db';
import { processPayment } from 'lib/services/stripe';
import { Booking } from 'sequelize/models/Booking';
import { Service } from 'sequelize/models/Service';
import { Payment } from 'sequelize/models/Payment';

jest.mock('lib/services/stripe'); // Mock Stripe service for integration testing

describe('Stripe Integration Tests', () => {
  let bookingId: string;
  let serviceId: string;
  let mockPayment: Payment;

  beforeAll(async () => {
    // Sync the database
    await sequelize.sync({ force: true });

    // Create a mock service and booking for the payment
    const service = await Service.create({
      name: 'Test Service',
      description: 'This is a test service.',
      price: 20.0, // Price in EUR
      provider_id: 'provider-id',
    });

    const booking = await Booking.create({
      user_id: 'user-id',
      service_id: service.service_id,
      provider_id: 'provider-id',
      status: 'pending',
      appointment_time: new Date(),
    });

    serviceId = service.service_id;
    bookingId = booking.booking_id;

    // Mock payment response for the `processPayment` function
    mockPayment = {
      booking_id: bookingId,
      amount: 20.0,
      payment_method: 'card',
      status: 'completed',
      created_at: new Date(),
    } as Payment;

    (processPayment as jest.Mock).mockResolvedValue(mockPayment);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should process a payment successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        booking_id: bookingId,
        payment_method_id: 'pm_card_visa', // Stripe's test payment method
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('Payment processed successfully');
    expect(data.payment).toHaveProperty('status', 'completed');
    expect(data.payment.amount).toBe(20.0);
  });

  it('should fail to process payment with an invalid card', async () => {
    (processPayment as jest.Mock).mockRejectedValue(new Error('Payment failed: Invalid card'));

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        booking_id: bookingId,
        payment_method_id: 'pm_card_declined', // Stripe's declined card test method
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('Error processing payment');
  });
});
