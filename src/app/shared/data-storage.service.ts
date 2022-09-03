import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { exhaustMap, take, tap } from "rxjs/operators";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  public storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http
      .put(
        "https://angular-http-2a2cf-default-rtdb.firebaseio.com/recipes.json",
        recipes
      )
      .subscribe((response) => {});
  }

  public fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        "https://angular-http-2a2cf-default-rtdb.firebaseio.com/recipes.json?"
      )
      .pipe(
        tap((response) => {
          this.recipeService.setRecipes(response);
        })
      );
  }
}
