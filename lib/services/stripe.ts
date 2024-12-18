import Stripe from 'stripe';
import { Booking } from '../models/Booking';
import { Service } from '../models/Service';
import { Payment } from '../models/Payment';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const processPayment = async (bookingId: string, paymentMethodId: string) => {
  try {
    // Fetch the booking
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Fetch the associated service to calculate the total amount
    const service = await Service.findByPk(booking.service_id);
    if (!service) {
      throw new Error('Service not found');
    }

    // Calculate total amount (e.g., service price, or add any other business logic)
    const totalAmount = service.price; // Assume the service price is the total amount for simplicity

    // Create a payment intent with the gateway (e.g., Stripe)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'eur',
      payment_method: paymentMethodId,
      confirm: true, // Immediately confirm
      metadata: {
        booking_id: bookingId,
      },
    });

    // Save the payment record
    const payment = await Payment.create({
      booking_id: bookingId,
      amount: totalAmount,
      payment_method: 'card',
      status: paymentIntent.status === 'succeeded' ? 'completed' : 'failed',
      created_at: new Date(),
    });

    return payment;
  } catch (error: any) {  // Type the error as `any` or a more specific type
    console.error('Payment failed:', error);
    throw new Error(`Payment failed: ${error.message || 'Unknown error'}`);
  }
};
