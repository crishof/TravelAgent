import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgentService } from '../../services/agent.service';
import { IAgent } from '../../model/agent.model';
import { LoadingComponent } from '../../utils/loading/loading.component';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.css',
})
export class AgentComponent implements OnInit {
  agentList: IAgent[] = [];
  readonly _agentService = inject(AgentService);
  isLoading: boolean = true;

  ngOnInit(): void {
    this.isLoading = true;
    this._agentService.getAllAgents().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.agentList = data;
          this.isLoading = false;
        }, 500); // Simulate a 500ms delay
      },
      error: (err) => {
        console.error('Error fetching agents:', err);
        this.isLoading = false;
      },
    });
  }
}
