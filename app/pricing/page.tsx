import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const pricingPlans = [
  {
    name: 'Basic',
    price: '$9.99',
    features: ['Book up to 5 appointments/month', 'Access to salon services', 'Email support'],
  },
  {
    name: 'Pro',
    price: '$19.99',
    features: ['Unlimited appointments', 'Access to salon and at-home services', 'Priority email support', 'Exclusive discounts'],
  },
  {
    name: 'Business',
    price: '$49.99',
    features: ['Multiple staff accounts', 'Advanced booking management', 'Analytics and reporting', '24/7 phone support'],
  },
]

export default function Pricing() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Pricing Plans</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-4xl font-bold mb-4">{plan.price}</p>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="p-6 mt-auto">
              <Button className="w-full">Choose Plan</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

