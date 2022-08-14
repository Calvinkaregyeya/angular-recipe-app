import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";

const appRoutes: Routes = [
  { path: "recipes", loadChildren: "./recipes/recipes-module#RecipeModule" },
  {
    path: "shopping-list",
    loadChildren: "./shopping-list/shopping-list-module#ShoppingListModule",
  },
  { path: "auth", loadChildren: "./auth/auth-module#AuthModule" },
  { path: "", redirectTo: "/auth", pathMatch: "full" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
