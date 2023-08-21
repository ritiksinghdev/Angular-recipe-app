import { Component, OnInit, OnDestroy, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy,OnChanges {
  ingredients: Ingredient[];
  
  totalAmount:number;
  editedItemIndex: number;
  private subscription: Subscription;
  private subscription1: Subscription;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.slService.getIngredients();
    this.totalAmount=this.slService.totalAmount()

    console.log("--------------> oninit",this.totalAmount)
    this.subscription = this.slService.ingredientsChanged
      .subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
          
        }
      );
     
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)

    
  }
  onEditItem(index: number) {
    this.slService.startedEditing.next(index);
  }
  ondelete() {
    
    
    this.totalAmount=this.slService.totalAmount()
  }
  deelete() {
    
    this.slService.deleteIngredient(this.editedItemIndex);
    this.totalAmount=this.slService.totalAmount()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  addtoPayment(){
    console.log(this.slService.getIngredients());
  }
}
  
