"use client";
import useSWR from "swr";
import Select from "react-select";

const fetchModels = () => fetch("/api/getEngines").then((res) => res.json());

function ModelSelection() {
  const { data: models, isLoading } = useSWR("models", fetchModels);
  const { data: model, mutate: setModal } = useSWR("model", {
    fallbackData: "text-davinci-003",
  });

  return (
    <div>
      <Select
        className="mt-2"
        options={models?.modelOptions}
        defaultValue={model}
        placeholder={model}
        isSearchable={true}
        isLoading={isLoading}
        menuPosition="fixed"
        classNames={{
          control: (state) => "bg-[#434654] border-[#434654]",
        }}
        onChange={(e: any) => {
          setModal(e.value);
        }}
      />
    </div>
  );
}

export default ModelSelection;
