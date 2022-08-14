import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGaurd } from "../auth/auth-gaurd";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeResolver } from "./recipe-resolver.service";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesComponent } from "./recipes.component";

const routes: Routes = [
  {
    path: "",
    component: RecipesComponent,
    resolve: [RecipeResolver],
    canActivate: [AuthGaurd],
    children: [
      { path: "", component: RecipeStartComponent },
      { path: "new", component: RecipeEditComponent },
      {
        path: ":id",
        component: RecipeDetailComponent,
        resolve: [RecipeResolver],
      },
      {
        path: ":id/edit",
        component: RecipeEditComponent,
        resolve: [RecipeResolver],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipeRoutingModule {}
