import { Button, Group } from "@mantine/core";
import type { Preset } from "@yuuka/api";
import { useMasterData } from "../../../providers/MasterDataProvider";

interface Props {
  onPreset: (preset: Preset) => void;
}

export const JournalPresetList = (props: Props) => {
  const { onPreset } = props;

  const masterdata = useMasterData();
  const presets = masterdata.presets;

  return (
    <Group>
      {presets.map((preset) => (
        <PresetButton key={preset.name} preset={preset} onPreset={onPreset} />
      ))}
    </Group>
  );
};

const PresetButton = (props: {
  preset: Preset;
  onPreset: (preset: Preset) => void;
}) => {
  const { preset, onPreset } = props;

  return (
    <Button
      key={preset.name}
      variant="default"
      onClick={() => onPreset(preset)}
    >
      {preset.name}
    </Button>
  );
};
