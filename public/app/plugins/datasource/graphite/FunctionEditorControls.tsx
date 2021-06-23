import React, { Suspense } from 'react';
import { Icon, Tooltip } from '@grafana/ui';

export interface FunctionDescriptor {
  text: string;
  params: string[];
  def: {
    category: string;
    defaultParams: string[];
    description?: string;
    fake: boolean;
    name: string;
    params: string[];
    /**
     * True if the function was not found on the list of available function descriptions.
     */
    unknown?: boolean;
  };
}

export interface FunctionEditorControlsProps {
  onMoveLeft: (func: FunctionDescriptor) => void;
  onMoveRight: (func: FunctionDescriptor) => void;
  onRemove: (func: FunctionDescriptor) => void;
}

const FunctionDescription = React.lazy(async () => {
  // @ts-ignore
  const { default: rst2html } = await import(/* webpackChunkName: "rst2html" */ 'rst2html');
  return {
    default(props: { description?: string }) {
      return <div dangerouslySetInnerHTML={{ __html: rst2html(props.description ?? '') }} />;
    },
  };
});

const FunctionHelpButton = (props: { description?: string; name: string }) => {
  if (props.description) {
    let tooltip = (
      <Suspense fallback={<span>Loading description...</span>}>
        <FunctionDescription description={props.description} />
      </Suspense>
    );
    return (
      <Tooltip content={tooltip} placement={'bottom-end'}>
        <Icon className={props.description ? undefined : 'pointer'} name="question-circle" />
      </Tooltip>
    );
  }

  return (
    <Icon
      className="pointer"
      name="question-circle"
      onClick={() => {
        window.open(
          'http://graphite.readthedocs.org/en/latest/functions.html#graphite.render.functions.' + props.name,
          '_blank'
        );
      }}
    />
  );
};

export const FunctionEditorControls = (
  props: FunctionEditorControlsProps & {
    func: FunctionDescriptor;
  }
) => {
  const { func, onMoveLeft, onMoveRight, onRemove } = props;
  return (
    <div
      style={{
        display: 'flex',
        width: '60px',
        justifyContent: 'space-between',
      }}
    >
      <Icon name="arrow-left" onClick={() => onMoveLeft(func)} />
      <FunctionHelpButton name={func.def.name} description={func.def.description} />
      <Icon name="times" onClick={() => onRemove(func)} />
      <Icon name="arrow-right" onClick={() => onMoveRight(func)} />
    </div>
  );
};