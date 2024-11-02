import TodoComponent from "@/components/todo-component";
import ToogleTheme from "@/components/global/toggole-theme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>

<Card className="w-full max-w-4xl mx-auto">
      <CardHeader >
        <div className="flex flex-row justify-between items-center">
        <CardTitle className="dark:text-gray-100">Todo Management</CardTitle>  <ToogleTheme />
        </div>
        <Separator className="my-4" />
       
      </CardHeader>
      <CardContent>
      <TodoComponent />
      </CardContent>
    </Card>
    </>
  );
}
