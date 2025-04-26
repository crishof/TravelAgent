import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IAgent } from '../../model/agent.model';
import { AgentService } from '../../services/agent.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.css',
})
export class AgentComponent implements OnInit {
  agentList: IAgent[] = [];
  private _agentService = inject(AgentService);

  ngOnInit(): void {
    this._agentService.getAllAgents().subscribe((data: IAgent[]) => {
      this.agentList = data;
    });
  }
}
