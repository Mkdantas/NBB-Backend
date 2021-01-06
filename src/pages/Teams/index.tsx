import React, { useEffect, useState } from 'react';
import { IonAvatar, IonButton, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import fire from 'firebase';

import './styles.css';
import { addOutline } from 'ionicons/icons';

const Teams: React.FC = () => {
  const db = fire.firestore();

  const [teams, setTeams] = useState([{}]);

  useEffect(()=>{
  const fetchTeams = async () =>{
  const fetchedTeams = await db.collection('teams').get();
  setTeams(fetchedTeams.docs.map((doc:any) =>{
    return doc.data();
  }))
  
}
fetchTeams();
//eslint-disable-next-line
  }, [] );

  return (
    <IonPage className="teams-page">
      <IonHeader>
        <IonToolbar>
          <IonMenuButton slot="start"/>
          <IonTitle>Teams</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerDirection="forward" routerLink="/add-team">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
        <IonList>
          {teams.map( (team:any) =>{
            return(
              <IonItem key={Math.random()}>
            <IonAvatar slot="start">
                <img src={team.logo} alt={`${team.name}-logo`}/>
            </IonAvatar>
                <IonLabel>{team.name}</IonLabel>
            </IonItem>
            )
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Teams;