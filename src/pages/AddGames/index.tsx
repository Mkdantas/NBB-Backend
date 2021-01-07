import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonIcon, IonDatetime, IonSelect, IonSelectOption } from '@ionic/react';
import fire from 'firebase';

import './styles.css';
import { arrowBack } from 'ionicons/icons';
import { Redirect } from 'react-router';

const AddGames: React.FC = () => {
  const db = fire.firestore();

  const randomID = () => {
    return Math.random().toString(9).substr(2, 9);
  };
  // eslint-disable-next-line
  const [ID, setID] = useState(randomID());
  const [selectedDate, setSelectedDate] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [visitorTeam, setVisitorTeam] = useState('');
  const [validated, setValidated] =  useState(false);
  const [teams, setTeams] = useState([{}]);

  const submitGame = (e:any) =>{
    e.preventDefault();
    db.collection("games").doc(ID).set({
      ID,
      homeTeam,
      visitorTeam,
      selectedDate
    }).then(() =>{
      setValidated(true);
    }).catch(function (error) {
      console.error("Error adding document: ", error);
    });
  }
  const fetchTeams = async () => {
    const fetchedTeams = await db.collection("teams").get();
    setTeams(
      fetchedTeams.docs.map((doc: any) => {
        return doc.data();
      })
    );
  };

  useEffect(() => {
    fetchTeams();
    //eslint-disable-next-line
  }, [] );
  return (
    <IonPage className="add-team-page">
      {validated ? <Redirect to="/games"/> : null}
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" slot="start" routerDirection="back" routerLink="/games">
            <IonIcon ios={arrowBack} md={arrowBack}/> 
          </IonButton>
          <IonTitle>Add a new Game</IonTitle> 
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={submitGame}>
          <IonItem>
          <IonSelect value={homeTeam} onIonChange={ (e:any) => setHomeTeam(e.detail.value!)} placeholder="Home Team" >
              {teams.map((team:any) =>{
                return (
                  <IonSelectOption key={Math.random()} value={team.name}>{team.name}</IonSelectOption>
                )
              })}
            </IonSelect>
          </IonItem>
          <IonItem>
          <IonSelect value={visitorTeam} onIonChange={ (e:any) => setVisitorTeam(e.detail.value!)} placeholder="Visitor Team" >
              {teams.map((team:any) =>{
                return (
                  <IonSelectOption key={Math.random()} value={team.name}>{team.name}</IonSelectOption>
                )
              })}
            </IonSelect>
          </IonItem>
         <IonItem>
         <IonLabel position="floating">Date:</IonLabel>
         <IonDatetime displayFormat={"MMM DD, YYYY HH:mm"} placeholder="Select Date" value={selectedDate} onIonChange={e => setSelectedDate(e.detail.value!)}></IonDatetime>
         </IonItem>
         <div className="submit-button">
         <IonButton expand="block" type="submit" fill="solid">Send</IonButton>
         </div>
       </form>
      </IonContent>
    </IonPage>
  );
};

export default AddGames;