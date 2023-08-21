import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  SimpleChanges
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;
  @Input() tsum:number;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;
  @Output() sum= new EventEmitter<number>;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService.startedEditing
      .subscribe(
        (index: number) => {
          this.editedItemIndex = index;
          this.editMode = true;
          this.editedItem = this.slService.getIngredient(index);
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        }
      );
      // this.sum=this.slService.totalAmount()
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.slService.updateIngredient(this.editedItemIndex, newIngredient);
      this.tsum = this.slService.totalAmount();
      console.log(this.sum)
      this.sum.emit(this.tsum)
    } else {
      this.slService.addIngredient(newIngredient);
      this.tsum = this.slService.totalAmount();
      console.log(this.sum)
      this.sum.emit(this.tsum)
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    
    this.slService.deleteIngredient(this.editedItemIndex);
    console.log(this.editedItemIndex)
    this.tsum = this.slService.totalAmount();
    console.log(this.sum)
    this.sum.emit(this.tsum)
    this.onClear();
    return this.sum
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
   
}
