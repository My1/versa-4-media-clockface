function mySettings(props) {
  let screenWidth = props.settingsStorage.getItem("screenWidth");
  let screenHeight = props.settingsStorage.getItem("screenHeight");

  return (
    <Page>
      <Section title={
        <Text bold align="center">
          Security Key
        </Text>
      }>
          <TextInput
            label="Enter the same (random) key both here and in Tasker for more security. If there is no Key, the App will set a default."
            settingsKey="httpkey"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings)
