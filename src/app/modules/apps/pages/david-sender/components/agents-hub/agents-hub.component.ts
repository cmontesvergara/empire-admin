import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';


interface AgentPlan {
  id: string;
  title: string;
  tagline: string;
  benefits: string[];
  price: string;
  badge?: 'Popular' | 'Nuevo' | 'Gratis';
}

@Component({
  selector: 'david-sender-agents-hub',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agents-hub.component.html',
  styleUrl: './agents-hub.component.scss',
})
export class AgentsHubComponent {
  @Output() selectionChange = new EventEmitter<AgentPlan>();

  // Datos cargados desde TS (puedes reemplazarlos por los tuyos)
  plans: AgentPlan[] = [
    {
      id: 'generic',
      title: 'Genérico',
      tagline: 'Agente BIGSO ideal para campañas masivas e informativas.',
      benefits: [
        'Costo por mensaje muy bajo',
        'Disponible 24/7',
        'Perfecto para difusiones rápidas',
      ],
      price: 'Desde $0.01/mensaje',
    },
    {
      id: 'corporate',
      title: 'Corporativo',
      tagline: 'Agente BIGSO con el nombre y logo de tu empresa.',
      benefits: [
        'Mayor confianza y reputación',
        'Mejor tasa de apertura',
        'Imagen de marca profesional',
      ],
      price: 'Desde $99/mes',
      badge: 'Nuevo',
    },
    {
      id: 'transactional',
      title: 'Transaccional',
      tagline:
        'Agente BIGSO dedicado exclusivamente a mensajes transaccionales.',
      benefits: [
        'Mayor confianza de la audiencia',
        'Agentes optimizados para notificaciones y alertas',
        'Enfoque en mensajes críticos y relevantes',
      ],
      price: 'Desde $29/mes',
      badge: 'Popular',
    },

    {
      id: 'client',
      title: 'Propio',
      tagline: 'Usa tu propia cuenta de WhatsApp.',
      benefits: [
        'Confianza total del receptor',
        'Máxima personalización',
        'Sin costo adicional',
      ],
      price: 'GRATIS',
      badge: 'Gratis',
    },
    {
      id: 'category',
      title: 'Especializado',
      tagline: 'Agente BIGSO enfocado en tu sector de negocios.',
      benefits: [
        'Alta afinidad con tu audiencia',
        'Menos reportes',
        'Mensajes más relevantes',
      ],
      price: 'Desde $49/mes',
      badge: 'Nuevo',
    },
  ];

  selectedId: string | null = null;

  select(plan: AgentPlan) {
    this.selectedId = plan.id;
    this.selectionChange.emit(plan);
  }
  getSelectedPlanTitle(): string | undefined {
    const plan = this.plans.find((p) => p.id === this.selectedId);
    return plan ? plan.title : undefined;
  }

  isSelected(plan: AgentPlan) {
    return this.selectedId === plan.id;
  }

  trackById = (_: number, p: AgentPlan) => p.id;
}
