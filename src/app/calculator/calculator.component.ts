import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { create, all } from 'mathjs';

@Component({
  selector: 'app-calculator',
  standalone: true,
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class CalculatorComponent {
  display: string = '';
  historyDisplay: string = '';
  private math: any;

  constructor() {
    this.math = create(all, {
      number: 'BigNumber', 
      precision: 64
    });
  }

  appendToInput(value: string) {
    if (this.display === 'Error') this.clear();
    this.display += value;
  }
  
  handleFunction(func: string) {
    if (this.display === 'Error') this.clear();
    
    switch (func) {
      case 'x^2':
        this.display += '^2';
        break;
      case '!':
        this.display += '!';
        break;
      default: 
        this.display += func;
    }
  }

  clear() {
    this.display = '';
    this.historyDisplay = '';
  }

  delete() {
    if (this.display !== 'Error') {
       this.display = this.display.slice(0, -1);
    }
  }

  calculate() {
    if (this.display === '' || this.display === 'Error') return;
    
    try {
      let expression = this.display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'pi');
        
      expression = this.preprocessExpression(expression);

      const result = this.math.evaluate(expression);
      
      const roundedResult = this.math.round(result, 4);
      
      this.historyDisplay = this.display + ' =';

      this.display = this.math.format(roundedResult, { notation: 'fixed' });

    } catch (error) {
      this.display = 'Error';
      console.error('Error en el cálculo:', error);
    }
  }

  private preprocessExpression(expr: string): string {
    return expr.replace(/(\d+)!/g, 'factorial($1)');
  }
}
