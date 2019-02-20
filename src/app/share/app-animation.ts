import {animate, animateChild, group, query, style, transition, trigger} from '@angular/animations';

export const SlideAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ],
      { optional: true }),
    query(':enter', [
      style({ left: '-100%', zIndex: '1'})
    ],
      { optional: true }),

    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [
        group([
          animate('475ms cubic-bezier(0.785, 0.135, 0.150, 0.860)', style({ left: '100%', zIndex: '2'})),
          animate('325ms 100ms cubic-bezier(0.785, 0.135, 0.150, 0.860)', style({ opacity: '0'}))
        ])
      ],
        { optional: true }),
      query(':enter', [
        animate('375ms 100ms cubic-bezier(0.785, 0.135, 0.150, 0.860)', style({ left: '0%', zIndex: '3'}))
      ],{ optional: true })
    ]),
    query(':enter', animateChild(), { optional: true }),
  ]),
]);
