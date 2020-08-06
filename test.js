import React, { useState, useEffect } from 'react';

import { FlatList } from 'react-native-gesture-handler';
import { parseISO } from 'date-fns';
import { format } from 'date-fns-tz';

import { useDispatch } from 'react-redux';
import {
  Header,
  HeaderText,
  ButtonView,
  ViewText,
  TextNextTrip,
  TimeInfo,
  Trajectory,
  Item,
  TravelInfo,
  LineTrajectory,
  TimeLine,
  TimeLineContent,
  IconCalendar,
  TimeContainer,
  IconHours,
  LineTrip,
  PointIcon,
  PointLocation,
  TextDataExit,
  LocationText,
  TextHoursExit,
  PassengersInfo,
  AmountPassengers,
  IconPassenger,
  TextNumberValuePassager,
  TextToBoard,
  TextToBoardValue,
  BoardingInfo,
  BoardContainer,
  ViewNextTrip,
  LoadingContainer,
  Line,
  LineModal,
  OptionEdit,
  OptionEditGreen,
  TextEdit,
  ViewOptionsEdit,
} from './styles';

import TouchableOpacity from '~/components/TouchableOpacity';
import ModalCustom from '~/components/ModalCustom';
import { setTrip } from '~/store/modules/trip/actions';

export default function NextTrip({ navigation, nextTrip, passengers }) {
  const [hours, setHours] = useState('');
  const [date, setDate] = useState('');
  const [nextTravel, setNextTravel] = useState({});
  const [modalEdit, setModalEdit] = useState(false);
  const dispatch = useDispatch();

  function formatTime() {
    const parsedDate = parseISO(nextTrip.travel_time);
    const formattedHour = format(parsedDate, 'HH:mm');
    const formattedDate = format(parsedDate, 'dd/MM/yyyy');
    setDate(formattedDate);
    setHours(formattedHour);
  }
  useEffect(() => {
    setNextTravel(nextTrip);
    formatTime();
  }, []);

  function handleNavigate(page, params) {
    navigation.navigate(page, params);
  }
  function editTravel(trip) {
    const routes = trip.routes.map((item, index) => ({
      ...trip.routes[index].travel_address,
      address_string: `${trip.routes[index].travel_address.street}, ${
        trip.routes[index].travel_address.number
          ? trip.routes[index].travel_address.number
          : ''
      } ${trip.routes[index].travel_address.neighborhood}, ${
        trip.routes[index].travel_address.city
      } - ${trip.routes[index].travel_address.state}`,
      order: index + 1,
    }));
    dispatch(
      setTrip({
        ...trip,
        routes,
        dateTrip: parseISO(trip.travel_time),
        waitingTime: trip.waiting_time,
        total_passengers_boarded: nextTravel.totalPassengers,
      })
    );
  }

  return (
    <TouchableOpacity
      onPress={() => {
        handleNavigate('AddPassager', {
          travels: nextTravel,
          trip: nextTravel,
          progress: false,
          passengers,
        });
      }}
    >
      <Header>
        <HeaderText>
          <TextNextTrip>Próxima Viagem</TextNextTrip>
        </HeaderText>

        <ButtonView
          onPress={() => {
            // handleNavigate('AddPassager', {
            //   travels: nextTravel,
            //   trip: nextTravel,
            //   progress: false,
            //   passengers,
            // });
            setModalEdit(true);
          }}
        >
          <ViewText>EDITAR</ViewText>
        </ButtonView>
      </Header>
      {/* {loading ? (
        <ViewNextTrip>
          <LoadingContainer>
            <ActivityIndicator size="large" color="#50B4CB" />
          </LoadingContainer>
        </ViewNextTrip>
      ) : (
        <> */}
      <ModalCustom show={modalEdit} setShow={setModalEdit} isBottomModal>
        <>
          <TextEdit>O que você deseja editar?</TextEdit>
          <ViewOptionsEdit
            onPress={() => {
              editTravel(nextTravel);
              handleNavigate('AddTrajectory', {
                edit: true,
              });
              setModalEdit(false);
            }}
          >
            <OptionEdit> Trajeto</OptionEdit>
            <Line />
          </ViewOptionsEdit>
          <ViewOptionsEdit
            onPress={() => {
              editTravel(nextTravel);
              handleNavigate('CreateTrip', {
                edit: true,
              });
              setModalEdit(false);
            }}
          >
            <OptionEdit> Veículo e Passageiros</OptionEdit>
            <Line />
          </ViewOptionsEdit>
          <ViewOptionsEdit
            onPress={() => {
              editTravel(nextTravel);
              handleNavigate('TripFrequency', {
                edit: true,
              });
              setModalEdit(false);
            }}
          >
            <OptionEdit> Frequência da viagem</OptionEdit>
          </ViewOptionsEdit>
        </>
      </ModalCustom>
      <ViewNextTrip>
        <TravelInfo>
          <Trajectory>
            <FlatList
              keyExtractor={index => index.toString()}
              data={nextTravel.routes}
              renderItem={({ item, index }) => (
                <>
                  <Item isLastItem={index + 1 === nextTravel.routes.length}>
                    <TimeLine>
                      {index + 1 === nextTravel.routes.length ? (
                        <PointLocation />
                      ) : (
                        <>
                          <PointIcon />
                          <LineTrajectory />
                          <LineTrajectory />
                          <LineTrajectory />
                          <LineTrajectory />
                          <LineTrajectory />
                          <LineTrajectory />
                        </>
                      )}
                    </TimeLine>
                    <TimeLineContent>
                      <LocationText isCity>
                        {item.travel_address.city}
                      </LocationText>
                      <LocationText>
                        {item.travel_address.street},{' '}
                        {item.travel_address.number === null
                          ? ' '
                          : `${item.travel_address.number}, `}
                        {item.travel_address.neighborhood}
                      </LocationText>
                    </TimeLineContent>
                  </Item>
                </>
              )}
            />
          </Trajectory>
          <TimeInfo>
            <TimeContainer>
              <IconCalendar />
              <TextDataExit>{date}</TextDataExit>
            </TimeContainer>
            <TimeContainer>
              <IconHours />
              <TextHoursExit>{hours}h</TextHoursExit>
            </TimeContainer>
          </TimeInfo>
        </TravelInfo>
        <LineTrip />
        <PassengersInfo>
          <AmountPassengers>
            <IconPassenger />
            <TextNumberValuePassager isNumber>
              {passengers.length}
            </TextNumberValuePassager>
            <TextNumberValuePassager>passageiros</TextNumberValuePassager>
          </AmountPassengers>
          <BoardingInfo>
            <BoardContainer isFirst>
              <TextToBoard>
                A embarcar: <TextToBoardValue isFirst>0</TextToBoardValue>
              </TextToBoard>
            </BoardContainer>
            <BoardContainer>
              <TextToBoard>
                Embarcados:{' '}
                <TextToBoardValue>{passengers.length}</TextToBoardValue>
              </TextToBoard>
            </BoardContainer>
          </BoardingInfo>
        </PassengersInfo>
      </ViewNextTrip>
    </TouchableOpacity>
  );
}
