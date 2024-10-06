import { Button } from "~components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~components/ui/card"

import "~style.css"

function IndexPopup() {
  return (
    <Card className="w-72">
      <CardHeader className="bg-accent h-32 rounded-b-2xl">
        <CardTitle>Card Title 00000000</CardTitle>
        <CardDescription>Card Description</CardDescription>
        <Button className="text-accent2" variant="outline">
          Click Me
        </Button>
      </CardHeader>
      <CardContent className="text-accent2">
        <p className="text-accent2"> Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}

export default IndexPopup
