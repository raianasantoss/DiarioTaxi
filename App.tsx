import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

interface Corrida {
  id: number;
  localBusca: string;
  localDesembarque: string;
  tipoPagamento: string;
  nomePassageiro: string;
  valorCorrida: string;
}

const Home = () => {
  const [telaAtual, setTelaAtual] = useState<'home' | 'registrarCorrida' | 'registrosCorrida' | 'motorista'>('home');
  const [corridas, setCorridas] = useState<Corrida[]>([]);
  const [localBusca, setLocalBusca] = useState('');
  const [localDesembarque, setLocalDesembarque] = useState('');
  const [tipoPagamento, setTipoPagamento] = useState('Espécie');
  const [nomePassageiro, setNomePassageiro] = useState('');
  const [valorCorrida, setValorCorrida] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('João Silva');
  const [cpf, setCpf] = useState('123.456.789-00');
  const [dataNasc, setDataNasc] = useState('01/01/1990');
  const [chavePix, setChavePix] = useState('joao.silva@example.com');
  const [profileQrCode, setProfileQrCode] = useState<string | null>(null);
  const [qrCodePopupVisible, setQrCodePopupVisible] = useState(false);
  const [filtroTipoPagamento, setFiltroTipoPagamento] = useState('');
  const [ordenacao, setOrdenacao] = useState<'recentes' | 'antigos'>('recentes');
  const [intervalo, setIntervalo] = useState<'dia' | 'semana' | 'mes' | 'ano' | 'todos'>('todos');
  const [filtroPopupVisible, setFiltroPopupVisible] = useState(false);

  const validarCampos = () => {
    if (!localBusca || !localDesembarque || !tipoPagamento || !nomePassageiro || !valorCorrida) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return false;
    }
    return true;
  };

  const registrarCorrida = () => {
    if (!validarCampos()) return;

    const novaCorrida: Corrida = {
      id: corridas.length + 1,
      localBusca,
      localDesembarque,
      tipoPagamento,
      nomePassageiro,
      valorCorrida,
    };
    setCorridas([...corridas, novaCorrida]);
    setLocalBusca('');
    setLocalDesembarque('');
    setTipoPagamento('Espécie');
    setNomePassageiro('');
    setValorCorrida('');
    Alert.alert('Sucesso', 'Corrida registrada com sucesso!');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileQrCode(result.assets[0].uri);
    }
  };

  const handleSalvarInformacoes = async () => {
    if (!nome || !cpf || !dataNasc || !chavePix) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }
    setModalVisible(false);
    Alert.alert('Sucesso', 'Informações salvas com sucesso!');
  };

  const excluirCorrida = (id: number) => {
    setCorridas(corridas.filter(corrida => corrida.id !== id));
    Alert.alert('Sucesso', 'Corrida excluída com sucesso!');
  };

  const editarCorrida = (corrida: Corrida) => {
    setLocalBusca(corrida.localBusca);
    setLocalDesembarque(corrida.localDesembarque);
    setTipoPagamento(corrida.tipoPagamento);
    setNomePassageiro(corrida.nomePassageiro);
    setValorCorrida(corrida.valorCorrida);
  };

  const salvarEdicao = () => {
    if (!validarCampos()) return;

    const corridasAtualizadas = corridas.map(corrida =>
      corrida.id === corridas.length ? { ...corrida, localBusca, localDesembarque, tipoPagamento, nomePassageiro, valorCorrida } : corrida
    );
    setCorridas(corridasAtualizadas);
    Alert.alert('Sucesso', 'Corrida editada com sucesso!');
  };

  const corridasFiltradas = corridas
    .filter(corrida => filtroTipoPagamento ? corrida.tipoPagamento === filtroTipoPagamento : true)
    .sort((a, b) => ordenacao === 'recentes' ? b.id - a.id : a.id - b.id);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {telaAtual === 'home' ? (
        <View style={styles.homeContainer}>
          <Image source={require('./icon.png')} style={styles.logo} />
          <Text style={styles.title}>Bem-vindo ao Diário Taxi</Text>
          <TouchableOpacity style={styles.button} onPress={() => setTelaAtual('registrarCorrida')}>
            <Text style={styles.buttonText}>Registrar Corrida</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setTelaAtual('registrosCorrida')}>
            <Text style={styles.buttonText}>Registros de Corrida</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setTelaAtual('motorista')}>
            <Text style={styles.buttonText}>Motorista</Text>
          </TouchableOpacity>
        </View>
      ) : telaAtual === 'registrarCorrida' ? (
        <View style={styles.formContainer}>
          <Text style={styles.title}>Registrar Corrida</Text>
          <TextInput
            style={styles.input}
            placeholder="Local de Busca"
            value={localBusca}
            onChangeText={setLocalBusca}
          />
          <TextInput
            style={styles.input}
            placeholder="Local de Desembarque"
            value={localDesembarque}
            onChangeText={setLocalDesembarque}
          />
          <View style={styles.radioButtonContainer}>
            <Text>Forma de Pagamento:</Text>
            <RadioButton.Group onValueChange={setTipoPagamento} value={tipoPagamento}>
              <RadioButton.Item label="Espécie" value="Espécie" />
              <RadioButton.Item label="PIX" value="PIX" />
            </RadioButton.Group>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nome do Passageiro"
            value={nomePassageiro}
            onChangeText={setNomePassageiro}
          />
          <TextInput
            style={styles.input}
            placeholder="Valor da Corrida"
            value={valorCorrida}
            onChangeText={setValorCorrida}
            keyboardType="numeric"
          />
          {tipoPagamento === 'PIX' && (
            <TouchableOpacity style={styles.button} onPress={() => setQrCodePopupVisible(true)}>
              <Text style={styles.buttonText}>Exibir QR Code PIX</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={registrarCorrida}>
            <Text style={styles.buttonText}>Registrar Corrida</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setTelaAtual('home')}>
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      ) : telaAtual === 'registrosCorrida' ? (
        <View style={styles.relatoriosContainer}>
          <Text style={styles.title}>Relatórios de Corridas</Text>
          <TouchableOpacity style={styles.button} onPress={() => setFiltroPopupVisible(true)}>
            <Text style={styles.buttonText}>Filtrar</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={filtroPopupVisible}
            onRequestClose={() => setFiltroPopupVisible(false)}
          >
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.filterButton} onPress={() => setFiltroTipoPagamento('PIX')}>
                <Text style={styles.buttonText}>Filtrar por PIX</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton} onPress={() => setFiltroTipoPagamento('Espécie')}>
                <Text style={styles.buttonText}>Filtrar por Espécie</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton} onPress={() => setFiltroTipoPagamento('')}>
                <Text style={styles.buttonText}>Limpar Filtros</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton} onPress={() => setOrdenacao('recentes')}>
                <Text style={styles.buttonText}>Ordenar por Mais Recentes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton} onPress={() => setOrdenacao('antigos')}>
                <Text style={styles.buttonText}>Ordenar por Mais Antigos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton} onPress={() => setIntervalo('dia')}>
                <Text style={styles.buttonText}>Último Dia</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton} onPress={() => setIntervalo('semana')}>
                <Text style={styles.buttonText}>Última Semana</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton} onPress={() => setIntervalo('mes')}>
                <Text style={styles.buttonText}>Último Mês</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton} onPress={() => setIntervalo('todos')}>
                <Text style={styles.buttonText}>Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setFiltroPopupVisible(false)}>
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          {corridasFiltradas.map(corrida => (
            <View key={corrida.id} style={styles.corridaItem}>
              <Text>ID: {corrida.id}</Text>
              <Text>Passageiro: {corrida.nomePassageiro}</Text>
              <Text>Local de Busca: {corrida.localBusca}</Text>
              <Text>Local de Desembarque: {corrida.localDesembarque}</Text>
              <Text>Pagamento: {corrida.tipoPagamento}</Text>
              <Text>Valor: {corrida.valorCorrida}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.button} onPress={() => setTelaAtual('home')}>
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      ) : telaAtual === 'motorista' ? (
        <View style={styles.motoristaContainer}>
          <Text style={styles.title}>Informações do Motorista</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Nome: {nome}</Text>
            <Text style={styles.infoText}>CPF: {cpf}</Text>
            <Text style={styles.infoText}>Data de Nascimento: {dataNasc}</Text>
            <Text style={styles.infoText}>Chave PIX: {chavePix}</Text>
            {profileQrCode && <Image source={{ uri: profileQrCode }} style={styles.qrCodeImage} />}
          </View>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Editar Informações</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
              />
              <TextInput
                style={styles.input}
                placeholder="CPF"
                value={cpf}
                onChangeText={setCpf}
              />
              <TextInput
                style={styles.input}
                placeholder="Data de Nascimento"
                value={dataNasc}
                onChangeText={setDataNasc}
              />
              <TextInput
                style={styles.input}
                placeholder="Chave PIX"
                value={chavePix}
                onChangeText={setChavePix}
              />
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Selecionar QR Code</Text>
              </TouchableOpacity>
              {profileQrCode && <Image source={{ uri: profileQrCode }} style={styles.largeQrCodeImage} />}
              <TouchableOpacity style={styles.button} onPress={handleSalvarInformacoes}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <TouchableOpacity style={styles.button} onPress={() => setTelaAtual('home')}>
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Modal para exibir o QR Code PIX */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={qrCodePopupVisible}
        onRequestClose={() => setQrCodePopupVisible(false)}
      >
        <View style={styles.modalView}>
          {profileQrCode ? (
            <Image source={{ uri: profileQrCode }} style={styles.largeQrCodeImage} />
          ) : (
            <Text>Nenhum QR Code disponível</Text>
          )}
          <TouchableOpacity style={styles.button} onPress={() => setQrCodePopupVisible(false)}>
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  relatoriosContainer: {
    flex: 1,
    padding: 20,
  },
  motoristaContainer: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    width: '100%',
  },
  radioButtonContainer: {
    marginBottom: 10,
  },
  corridaItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  filtrosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  ordenacaoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  intervaloContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  largeQrCodeImage: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  qrCodeImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
});

export default Home;