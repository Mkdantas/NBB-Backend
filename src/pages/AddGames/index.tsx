import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, IonIcon, IonDatetime } from '@ionic/react';
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
            <IonLabel position="floating">Home Team Name:</IonLabel>
            <IonInput value={homeTeam} onIonChange={e => setHomeTeam(e.detail.value!)}> </IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Visitor Team Name:</IonLabel>
            <IonInput value={visitorTeam} onIonChange={e => setVisitorTeam(e.detail.value!)}> </IonInput>
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