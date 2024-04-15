import json

import numpy as np
import torch
import pandas as pd
from datasets import load_dataset
from sklearn.preprocessing import MultiLabelBinarizer
from torch.utils.data import Dataset
from transformers import AutoTokenizer
from transformers import AutoModelForSequenceClassification
from transformers import TrainingArguments
from transformers import Trainer
from transformers import EvalPrediction
from sklearn.metrics import f1_score, roc_auc_score, accuracy_score, precision_score, recall_score, matthews_corrcoef

with open('config.json', 'r') as f:
    config = json.load(f)

dataset = load_dataset(config['dataset'])
data_labels = dataset['train'].features['labels'].feature.names

train = pd.DataFrame(dataset['train'], columns=['text', 'labels'])
test = pd.DataFrame(dataset['test'], columns=['text', 'labels'])
validation = pd.DataFrame(dataset['validation'], columns=['text', 'labels'])

mlb = MultiLabelBinarizer()

train_labels = mlb.fit_transform(train['labels']).astype(float)
train_labels = pd.DataFrame(train_labels, columns=mlb.classes_)
train = pd.concat([train, train_labels], axis=1)
test_labels = mlb.transform(test['labels']).astype(float)
test_labels = pd.DataFrame(test_labels, columns=mlb.classes_)
test = pd.concat([test, test_labels], axis=1)
validation_labels = mlb.transform(validation['labels']).astype(float)
validation_labels = pd.DataFrame(validation_labels, columns=mlb.classes_)
validation = pd.concat([validation, validation_labels], axis=1)

id2label = {k: v for k, v in enumerate(data_labels)}
label2id = {v: k for k, v in id2label.items()}


class MultiLabelDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_length):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = str(self.texts[idx])
        label = torch.tensor(self.labels[idx])

        encoding = self.tokenizer(text, truncation=True, padding='max_length', max_length=self.max_length, return_tensors='pt')

        ids = encoding['input_ids'].flatten()
        mask = encoding['attention_mask'].flatten()

        return {
            'input_ids': ids,
            'attention_mask': mask,
            'labels': label
        }


def multi_label_metrics(predictions, labels, threshold=config['threshold']):
    sigmoid = torch.nn.Sigmoid()
    predictions = sigmoid(torch.tensor(predictions))

    y_pred = np.zeros(predictions.shape)
    y_pred[np.where(predictions >= threshold)] = 1

    y_true = labels
    f1_micro = f1_score(y_true, y_pred, average='micro')
    roc_auc = roc_auc_score(y_true, predictions, average='micro')
    accuracy = accuracy_score(y_true, y_pred)

    return {
        'f1': f1_micro,
        'roc_auc': roc_auc,
        'accuracy': accuracy
    }


def compute_metrics(p: EvalPrediction):
    preds = p.predictions[0] if isinstance(p.predictions, tuple) else p.predictions
    return multi_label_metrics(preds, p.label_ids)


def calc_label_metrics(label, y_targets, y_preds, threshold=0.5):
    return {
        'label': label,
        'accuracy': accuracy_score(y_targets, y_preds),
        'precision': precision_score(y_targets, y_preds, zero_division=0),
        'recall': recall_score(y_targets, y_preds, zero_division=0),
        'f1': f1_score(y_targets, y_preds, zero_division=0),
        'mcc': matthews_corrcoef(y_targets, y_preds),
        'support': y_targets.sum(),
        'threshold': threshold,
    }


# TODO: iterate over the different model checkpoints
for model_name in config['checkpoints']:
    tokenizer = AutoTokenizer.from_pretrained(model_name)

    train_dataset = MultiLabelDataset(train['text'].tolist(), train_labels.values, tokenizer, config['max_seq_length'])
    test_dataset = MultiLabelDataset(test['text'].tolist(), test_labels.values, tokenizer, config['max_seq_length'])
    validation_dataset = MultiLabelDataset(validation['text'].tolist(), validation_labels.values, tokenizer, config['max_seq_length'])

    model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=len(data_labels), problem_type=config['task'], id2label=id2label, label2id=label2id)

    args = TrainingArguments(
        f'{model_name}-go-emotion',
        evaluation_strategy='epoch',
        learning_rate=config['learning_rate'],
        per_device_train_batch_size=config['train_batch_size'],
        per_device_eval_batch_size=config['eval_batch_size'],
        num_train_epochs=config['num_epochs'],
        weight_decay=config['weight_decay'],
    )

    trainer = Trainer(
        model=model,
        args=args,
        train_dataset=train_dataset,
        eval_dataset=test_dataset,
        tokenizer=tokenizer,
        compute_metrics=compute_metrics
    )

    trainer.train()

    trainer.evaluate(validation_dataset)

    trainer.save_model(f'{model_name}-go-emotion')

