export const homelabRoutes = [
  {
    label: 'Overview',
    icon: 'pi pi-objects-column',
    route: '/homelab',
  },
  {
    label: 'k3s Cluster',
    icon: 'pi pi-table',
    items: [
      {
        label: 'Resources',
        icon: 'pi pi-table',
        route: '/homelab/resources',
      },
      {
        label: 'Nodes',
        icon: 'pi pi-desktop',
        route: '/homelab/nodes',
      }
    ],
  },
  {
    label: 'Services',
    icon: 'pi pi-sparkles',
    route: '/homelab/services',
  },
]
