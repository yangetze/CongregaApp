import { PeopleList, CreatePerson } from './pages/people/PeoplePage';
import { EventsList, CreateEvent } from './pages/events/EventsPage';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>CongregaApp - Module 1 Skeleton (CQRS + Clean Arch)</h1>
      <div style={{ display: 'flex', gap: '50px' }}>
        <div>
          <CreatePerson />
          <hr />
          <PeopleList />
        </div>
        <div>
          <CreateEvent />
          <hr />
          <EventsList />
        </div>
      </div>
    </div>
  );
}

export default App;
