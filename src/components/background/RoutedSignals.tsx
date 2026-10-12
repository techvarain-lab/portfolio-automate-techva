import './routed-signals.css'

/** Abstract conveyor lanes: static rails and transform-only moving packets. */
export function RoutedSignals() {
  return <div className="conveyor-background" aria-hidden="true">
    <div className="conveyor-background__yard">
      {[0, 1, 2, 3, 4].map(lane => <div className="conveyor-lane" key={lane}>
        <div className="conveyor-lane__rollers" />
        <div className="conveyor-lane__cargo">
          {[0, 1, 2, 3, 4, 5].map(packet => <span className="conveyor-packet" key={packet}><i /><i /><i /></span>)}
        </div>
      </div>)}
    </div>
  </div>
}
