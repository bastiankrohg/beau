import { processPayment } from 'lib/services/stripe';
import { Payment } from 'lib/models/Payment';
import { Booking } from 'lib/models/Booking';
import { Service } from 'lib/models/Service';
import Stripe from 'stripe';

// Mock Stripe
jest.mock('stripe');
const mockStripe = Stripe as jest.MockedClass<typeof Stripe>;

// Mock PaymentIntent response
const mockPaymentIntent = {
  status: 'succeeded',
  id: 'pi_12345',
  amount_received: 2000,
};

// Cast the `create` method to allow Jest mocking
(mockStripe.prototype.paymentIntents.create as jest.Mock).mockResolvedValue(mockPaymentIntent);

describe('Stripe Payment Service', () => {
  let mockBooking: Partial<Booking>;
  let mockService: Partial<Service>;

  beforeAll(() => {
    // Mock Booking and Service models
    mockBooking = { booking_id: 'b_123', service_id: 's_123' };
    mockService = { price: 20 }; // Assume the price is €20

    // Mock database lookups
    Booking.findByPk = jest.fn().mockResolvedValue(mockBooking);
    Service.findByPk = jest.fn().mockResolvedValue(mockService);

    // Mock Payment creation
    Payment.create = jest.fn().mockImplementation((paymentData) => ({
      ...paymentData,
      payment_id: 'pay_123',
      status: 'completed',
    }));
  });

  it('should process payment successfully', async () => {
    const payment = await processPayment(mockBooking.booking_id!, 'payment_method_id_123');

    // Verify Stripe paymentIntent creation
    expect(mockStripe.prototype.paymentIntents.create).toHaveBeenCalledWith({
      amount: 2000, // €20 in cents
      currency: 'eur',
      payment_method: 'payment_method_id_123',
      confirm: true,
      metadata: {
        booking_id: mockBooking.booking_id,
      },
    });

    // Verify Payment record creation
    expect(Payment.create).toHaveBeenCalledWith({
      booking_id: mockBooking.booking_id,
      amount: mockService.price,
      payment_method: 'card',
      status: 'completed',
      created_at: expect.any(Date),
    });

    // Assert payment status
    expect(payment.status).toBe('completed');
  });

  it('should handle payment failure', async () => {
    (mockStripe.prototype.paymentIntents.create as jest.Mock).mockResolvedValueOnce({
      ...mockPaymentIntent,
      status: 'failed',
    });

    await expect(processPayment(mockBooking.booking_id!, 'payment_method_id_123'))
      .rejects
      .toThrow('Payment failed: Unknown error');
  });

  it('should throw an error if booking is not found', async () => {
    // Simulate Booking not found
    Booking.findByPk = jest.fn().mockResolvedValue(null);

    await expect(processPayment(mockBooking.booking_id!, 'payment_method_id_123'))
      .rejects
      .toThrow('Booking not found');
  });

  it('should throw an error if service is not found', async () => {
    // Simulate Service not found
    Service.findByPk = jest.fn().mockResolvedValue(null);

    await expect(processPayment(mockBooking.booking_id!, 'payment_method_id_123'))
      .rejects
      .toThrow('Service not found');
  });
});
