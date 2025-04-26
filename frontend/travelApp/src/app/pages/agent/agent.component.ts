import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgentService } from '../../services/agent.service';
import { IAgent } from '../../model/agent.model';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.css',
})
export class AgentComponent implements OnInit {
  agentList: IAgent[] = [];
  readonly _agentService = inject(AgentService);

  ngOnInit(): void {
    this._agentService.getAllAgents().subscribe((data: IAgent[]) => {
      this.agentList = data;
    });
  }
}
