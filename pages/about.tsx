import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card"

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">About BookMe</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>To make booking salon and at-home services easy and convenient for everyone.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p>To become the leading platform for beauty and wellness services booking worldwide.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              <li>Customer-first approach</li>
              <li>Innovation in service</li>
              <li>Transparency and trust</li>
              <li>Empowering local businesses</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

